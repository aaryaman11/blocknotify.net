from django.urls import path

from . import views

urlpatterns = [
    # path('', views.index, name='index'),
    # path('proposal/<int:proposal_id>/', views.read_proposal, name='read_proposal'),
    # path('user/<int:user_id>/', views.read_user, name='read_user'),
    # path('claim_share/<int:user_id>/<int:contract_id>', views.claim_share, name='claim_share'),
    # path('create_contract/', views.create_contract, name='create_contract'),
    # path('add_user/', views.add_user, name='add_user'),
    # path('add_proposal/', views.add_proposal, name='add_proposal'),
    # path('add_approval/', views.add_approval, name='add_approval'),
    # path('publish_if_ready/<int:proposal_db_id>/', views.publish_if_ready, name='publish_if_ready'),
    # path('read_contract/<int:contract_id>/', views.read_contract, name='read_contract'),
    # TODO: twitter_auth is not used yet, but this will likely be the callback location when we add OAuth2.0
    # path('twitter_auth/', views.twitter_auth, name='twitter_auth'),
    path('api/v1/', views.api.urls),
]
