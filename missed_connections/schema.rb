require 'pg'
require 'pry'

init_mc = <<-SQL
	CREATE TABLE missed_connections(
		id SERIAL PRIMARY KEY,
		post_id VARCHAR (255),
		headline VARCHAR(255),
		post_date VARCHAR(255),
		page_url VARCHAR(255),
		borough VARCHAR(255),
		preference VARCHAR(255),
		place VARCHAR(255),
		body_text text,
		latitude VARCHAR(255),
		longitude VARCHAR(255),
		created_at timestamp,
		updated_at timestamp
		);
SQL


db = PG.connect(dbname: 'mc')

db. exec('DROP TABLE IF EXISTS missed_connections')

db.exec(init_mc)