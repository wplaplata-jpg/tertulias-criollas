WITH current_max AS (
  SELECT COALESCE(MAX(CAST(SUBSTRING("publicCode" FROM 4) AS INTEGER)), 0) AS value
  FROM "Reservation"
  WHERE "publicCode" ~ '^TC-[0-9]+$'
),
ordered_reservations AS (
  SELECT
    id,
    ROW_NUMBER() OVER (ORDER BY "createdAt", id) AS row_number
  FROM "Reservation"
  WHERE "publicCode" IS NULL
)
UPDATE "Reservation"
SET "publicCode" = 'TC-' || LPAD((ordered_reservations.row_number + current_max.value)::TEXT, 4, '0')
FROM ordered_reservations, current_max
WHERE "Reservation".id = ordered_reservations.id;
