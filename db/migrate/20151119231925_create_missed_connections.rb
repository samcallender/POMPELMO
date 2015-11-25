class CreateMissedConnections < ActiveRecord::Migration
  def change
    create_table :missed_connections do |t|
      t.varchar :post_id
      t.varchar :headline
      t.varchar :post_date
      t.varchar :page_url
      t.varchar :borough
      t.varchar :preference
      t.varchar :place
      t.string :body_text
      t.varchar :latitude
      t.varchar :longitude
      t.timestamp :created_at
      t.timestamp :updated_at

      t.timestamps null: false
    end
  end
end
