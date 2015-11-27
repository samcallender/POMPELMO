class AlterBodyColumn < ActiveRecord::Migration
  def change
  	change_column :missed_connections, :body_text, :text 
  end
end
