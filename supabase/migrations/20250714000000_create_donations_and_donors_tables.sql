-- Create the donors table
CREATE TABLE donors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create a custom type for payment methods
CREATE TYPE payment_method AS ENUM ('CASH', 'CHEQUE', 'ONLINE', 'UPI');

-- Create the donations table
CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    amount NUMERIC(10, 2) NOT NULL,
    donor_id UUID NOT NULL REFERENCES donors(id),
    payment_type payment_method NOT NULL,
    cheque_number VARCHAR(50),
    transaction_id VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add comments to the tables and columns
COMMENT ON TABLE donors IS 'Stores information about individual donors.';
COMMENT ON COLUMN donors.id IS 'Primary key for the donors table.';
COMMENT ON COLUMN donors.name IS 'The full name of the donor.';
COMMENT ON COLUMN donors.email IS 'The unique email address of the donor.';
COMMENT ON COLUMN donors.phone IS 'The phone number of the donor.';

COMMENT ON TABLE donations IS 'Stores information about each donation received.';
COMMENT ON COLUMN donations.id IS 'Primary key for the donations table.';
COMMENT ON COLUMN donations.amount IS 'The amount of the donation.';
COMMENT ON COLUMN donations.donor_id IS 'Foreign key referencing the donor who made the donation.';
COMMENT ON COLUMN donations.payment_type IS 'The method of payment used for the donation.';
COMMENT ON COLUMN donations.cheque_number IS 'The cheque number, if payment was by cheque.';
COMMENT ON COLUMN donations.transaction_id IS 'The transaction ID for online or UPI payments.';

-- Create indexes for performance
CREATE INDEX idx_donors_email ON donors(email);
CREATE INDEX idx_donations_donor_id ON donations(donor_id);
