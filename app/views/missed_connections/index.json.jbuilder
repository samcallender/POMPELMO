json.array!(@missed_connections) do |missed_connection|
  json.extract! missed_connection, :id, :post_id, :headline, :post_date, :page_url, :borough, :preference, :place, :body_text, :latitude, :longitude, :created_at, :updated_at
  json.url missed_connection_url(missed_connection, format: :json)
end
