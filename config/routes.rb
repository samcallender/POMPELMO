Rails.application.routes.draw do
  get 'static_pages/help'

  get '/map' => 'static_pages#map'

  get '/missed_connections/m' => 'missed_connections#m'

  get '/missed_connections/m4m' => 'missed_connections#m4m'

  get '/missed_connections/m4t' => 'missed_connections#m4t'

  get '/missed_connections/m4w' => 'missed_connections#m4w'

  get '/missed_connections/t' => 'missed_connections#t'

  get '/missed_connections/t4m' => 'missed_connections#t4m'

  get '/missed_connections/t4t' => 'missed_connections#t4t'

  get '/missed_connections/t4w' => 'missed_connections#t4w'

  get 'missed_connections/w' => 'missed_connections#w'

  get '/missed_connections/w4m' => 'missed_connections#w4m'

  get '/missed_connections/w4t' => 'missed_connections#w4t'

  get '/missed_connections/w4w' => 'missed_connections#w4w'

  resources :missed_connections
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  root 'static_pages#map'


  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
