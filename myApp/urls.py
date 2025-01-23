from django.urls import path 
from myApp import views


urlpatterns=[
    path('' , views.index , name="index"),



    #REST API
    #REST API
    #REST API
    #REST API
    #REST API
    path('register' , views.register , name="register"),
    path('login' , views.login , name="login"),
    path('logout' , views.logout , name="logout"),
    path('loggedInUser' , views.get_user , name="LoggedInUser"),



    #FRIENDS REQUEST LOGIC
    path('numberFriendsRequests' , views.number_friends_requests , name="numberFriendsRequest"),
    path('sendRequest' , views.send_request , name="request"),
    path('friendsrequest' , views.get_friends_request , name="friendsrequest"),
    path('rejectInvitation' , views.reject_invitation , name="rejectInvitation"),
    path('acceptInvitation' , views.accept_invitation , name="acceptInvitation"),




    #FRIEND LIST
    path('getFriendsList' , views.get_friends_list , name="friendsList"),


    #CHAT LOGIC
    path('getConversations' , views.get_conversations , name="requestconversations"),
    path('conversationMessages' , views.load_conversation_by_id , name="conversationContent"), 
    path("sendNewMessage" , views.send_message , name="sendMessage"),
]


