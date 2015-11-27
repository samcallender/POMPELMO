class CreateMissedConnections < ActiveRecord::Migration
  def change
    create_table :missed_connections do |t|
      t.integer :post_id
      t.string :headline
      t.string :post_date
      t.string :page_url
      t.string :borough
      t.string :preference
      t.string :place
      t.string :body_text
      t.string :latitude
      t.string :longitude
      t.string :location_source
      t.timestamps null: false
    end
  end
end
