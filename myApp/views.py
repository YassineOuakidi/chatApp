from django.http import HttpResponse, JsonResponse , HttpResponseRedirect
from django.shortcuts import redirect, render
from .models import *
from django.urls import reverse
from json import loads
from django.db.utils import IntegrityError
from django.contrib import auth
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt

def index(request) :
    if not request.user.is_authenticated:
        return render(request , 'myApp/RegisterxLogin.html')
    else :
        return render(request , 'myApp/inbox.html' ,{
            'user' : request.user
        })
    






#Authentication Logic
#Authentication Logic
#Authentication Logic
#Authentication Logic
#Authentication Logic
#Authentication Logic
#Authentication Logic

def logout(request):
    auth.logout(request)
    return HttpResponseRedirect(reverse('index'))


def register(request):
    if request.method=='POST':
        post_data = loads(request.body.decode("utf-8"))
        if( post_data['password'] != post_data['confirmation']):
            return JsonResponse({'error' : 'Passwords should match'} , status='401')
        else :
            try:
                user = User.objects.create_user(post_data["username"] , post_data["email"] , post_data["password"])
                user.save()
                auth.login(request , user)
                return HttpResponseRedirect(reverse('index'))
            except IntegrityError as e:
                print(e)
                return JsonResponse({'error' : 'Username already exists' } , status = '401' )
    else :
        return HttpResponseRedirect(reverse('index'))



def login(request):
    print('hello')
    if request.method=='POST':
        post_data = loads(request.body.decode("utf-8"))
        user = auth.authenticate(username=post_data['username'] , password = post_data['password'])
        if user is not None:
            auth.login(request , user)
            return HttpResponseRedirect(reverse('index'))
        else :
            print('yes')
            return JsonResponse({'error' : 'Username or password incorrect'} , status='401')
    else :
        return HttpResponseRedirect(reverse('index'))
    



#Friendship Logic
#Friendship Logic
#Friendship Logic
#Friendship Logic
#Friendship Logic
#Friendship Logic
#Friendship Logic
#Friendship Logic


def number_friends_requests(request):
    number = Invitation.objects.filter(recipient = request.user).count()
    return JsonResponse({'number' : number})
    pass

@csrf_exempt
def send_request(request):
    if request.method=='POST':
        post_data = loads(request.body.decode('utf-8'))
        user = User.objects.filter(username = post_data['username']).first()
        if not user:
            return JsonResponse({'content' : 'No User with such username found'})
        else :
            tmp = Invitation.objects.filter(sender = request.user , recipient = user)
            if tmp.exists():
                return JsonResponse({'content' : 'Friend Request Already Pending'})
            else :
                new_invitation = Invitation.objects.create(sender = request.user , recipient = user)
                new_invitation.save()
            return JsonResponse({'content' : 'Friend request was sent succesfully'})
    else :
        print('Hello')

def accept_invitation(request):
    sender = User.objects.filter(username = loads(request.body.decode('utf-8'))['username']).first()
    newFrienfship = Conversation.objects.create(user1 = sender , user2 = request.user)
    newFrienfship.save()
    Invitation.objects.filter(sender = sender  , recipient=request.user).delete()
    return JsonResponse({"status" : "Done"})


def reject_invitation(request):
    sender = User.objects.filter(username = loads(request.body.decode('utf-8'))['username']).first()
    Invitation.objects.filter(sender = sender  , recipient=request.user).delete()
    return JsonResponse({'status' : 'Done'})
    pass


def get_friends_request(request) :
    requests = Invitation.objects.filter(recipient=request.user)
    
    return JsonResponse([request.sender.serialize() for request in requests] , safe=False)




#Friend List
#Friend List
#Friend List
#Friend List
#Friend List


def get_friends_list(request):
    answer =[]
    friendships = Conversation.objects.filter(Q(user1 = request.user) | Q(user2 = request.user ))
    for friendship in friendships:
        if friendship.user1 == request.user:
            answer.append(friendship.user2)
        else :
            answer.append(friendship.user1)
    return JsonResponse([user.serialize() for user in answer] , safe = False)




#Chat Logic
#Chat Logic
#Chat Logic
#Chat Logic
#Chat Logic
#Chat Logic


def get_conversations(request):
    response = []
    conversations = Conversation.objects.filter(Q(user1=request.user) | Q(user2=request.user))
    for conversation in conversations:
        if conversation.user1==request.user:
            response.append({
                'id' : conversation.id,
                'user' : conversation.user2.username,
            })
        else :
            response.append({
                'id' : conversation.id,
                'user' : conversation.user1.username,
            })
    return JsonResponse(response , safe = False)


def load_conversation_by_id(request):
    request_data = loads(request.body.decode('utf-8'))['conversation_id']
    myconversation = Conversation.objects.filter(id = request_data).first()
    messages = Message.objects.filter(conversation = myconversation)
    return JsonResponse([message.serialize() for message in messages] , safe=False)



def send_message(request):
    request_data = loads(request.body.decode('utf-8'))
    my_user = User.objects.filter(username = request_data['recipient']).first()
    myConversation = Conversation.objects.filter(Q(user1=my_user , user2 = request.user ) | Q(user1 = request.user , user2 = my_user)).first()
    new_message = Message.objects.create(conversation = myConversation , content = request_data['content'] , sender = request.user , recipient = my_user) 
    new_message.save();
    return JsonResponse({'id' : myConversation.id})

def get_user(request):
    return JsonResponse({'username' : request.user.username})