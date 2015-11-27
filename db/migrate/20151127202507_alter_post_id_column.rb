class AlterPostIdColumn < ActiveRecord::Migration
  def change
  	change_column :missed_connections, :post_id, :string
  end
end
