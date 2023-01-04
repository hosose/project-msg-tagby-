-- migrate:up
CREATE TABLE capture_job_info(
    idx INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    campaign_idx INT NOT NULL,
    campaign_title VARCHAR(50) NOT NULL,
    sns_type VARCHAR(15) NOT NULL,
    posting_count INT NOT NULL,
    keyword VARCHAR(50) NOT NULL,
    start_day TIMESTAMP NOT NULL,
    end_day TIMESTAMP NOT NULL,
    captured_count INT NOT NULL,
    run_count INT NOT NULL,
    last_run_at INT NOT NULL,
    admin_idx INT NOT NULL,
    state VARCHAR(15) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- migrate:down
DROP TABLE carture_job_info;
