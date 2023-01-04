-- migrate:up
CREATE TABLE capture_result_info(
    idx INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    job_idx INT NOT NULL,
    keyword VARCHAR(50) NOT NULL,
    bucket_path VARCHAR(50) NOT NULL,
    file_name VARCHAR(50) NOT NULL,
    image_url VARCHAR(50) NOT NULL,
    state VARCHAR(15) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT capture_result_job_idx_fkey FOREIGN KEY (job_idx) REFERENCES capture_job_info(idx)
);

-- migrate:down
DROP TABLE capture_result_info;
