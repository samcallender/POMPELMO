class MissedConnectionsController < ApplicationController
  before_action :set_missed_connection, only: [:show, :edit, :update, :destroy]

  # GET /missed_connections
  # GET /missed_connections.json
  def index
    # @missed_connections = MissedConnection.where("preference = 'm4m' and borough = 'mnh'")
    @missed_connections = MissedConnection.all
  end
# binding.pry

  # GET /missed_connections/1
  # GET /missed_connections/1.json
  def show
  end

  # GET /missed_connections/new
  def new
    @missed_connection = MissedConnection.new
  end

  # GET /missed_connections/1/edit
  def edit
  end

  # POST /missed_connections
  # POST /missed_connections.json
  def create
    @missed_connection = MissedConnection.new(missed_connection_params)

    respond_to do |format|
      if @missed_connection.save
        format.html { redirect_to @missed_connection, notice: 'Missed connection was successfully created.' }
        format.json { render :show, status: :created, location: @missed_connection }
      else
        format.html { render :new }
        format.json { render json: @missed_connection.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /missed_connections/1
  # PATCH/PUT /missed_connections/1.json
  def update
    respond_to do |format|
      if @missed_connection.update(missed_connection_params)
        format.html { redirect_to @missed_connection, notice: 'Missed connection was successfully updated.' }
        format.json { render :show, status: :ok, location: @missed_connection }
      else
        format.html { render :edit }
        format.json { render json: @missed_connection.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /missed_connections/1
  # DELETE /missed_connections/1.json
  def destroy
    @missed_connection.destroy
    respond_to do |format|
      format.html { redirect_to missed_connections_url, notice: 'Missed connection was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_missed_connection
      @missed_connection = MissedConnection.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def missed_connection_params
      params.require(:missed_connection).permit(:post_id, :headline, :post_date, :page_url, :borough, :preference, :place, :body_text, :latitude, :longitude, :created_at, :updated_at)
    end
end
