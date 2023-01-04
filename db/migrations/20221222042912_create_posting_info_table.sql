-- migrate:up
CREATE TABLE posting_info(
    idx INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    job_idx INT NOT NULL,
    username VARCHAR(30) NOT NULL,
    posting_url VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT posting_info_job_idx_fkey FOREIGN KEY (job_idx) REFERENCES capture_job_info(idx)  
);

-- migrate:down
DROP TABLE posting_info;
