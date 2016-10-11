class StaticPagesController < ApplicationController
  def home
  	@missed_connections = MissedConnection.all.sample(3)
  	@mc2 = @missed_connections[1]
  end

  def about
  end

  def map
  	now = Date.today
  	seven_days_ago = (now - 7)
  	a = Date.parse(seven_days_ago.to_s).to_s
  	yyyy = a[0..3]
    mm = a[5..6]
    dd = a[8..9]
    @start_date = mm+'/'+dd+'/'+yyyy

    b = Date.parse(now.to_s).to_s
    yyyy = b[0..3]
    mm = b[5..6]
    dd = b[8..9]
    @end_date = mm+'/'+dd+'/'+yyyy


    # b = Date.parse(Time.now.to_s)
   #  @end_date = (b >> 1).strftime("%d/%m/%Y %H:%M")[1..10]
  end
end
