from django.db import models
from django.contrib.auth.models import AbstractUser , Group , Permission


class User(AbstractUser):
    groups = models.ManyToManyField(
        Group,
        blank=True,
        related_name='custom_user_set',  
    )
    user_permissions = models.ManyToManyField(
        Permission,
        blank=True,
        related_name='custom_user_permissions_set',  
    )

    def serialize(self):
        return {
            'id' : self.id,
            'username' : self.username,
            'email' : self.email,
            'password' : self.password,
        }



class Conversation(models.Model):
    user1 = models.ForeignKey(User , on_delete=models.CASCADE , null=True , related_name='conversation_chat_user1')
    user2 = models.ForeignKey(User , on_delete=models.CASCADE , null=True , related_name='conversation_chat_user2')
    
    

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, null=True, related_name='conversation')
    timestamp = models.DateTimeField(auto_now_add=True)
    content = models.TextField(max_length=1000 , default=None)
    sender = models.ForeignKey(User , on_delete=models.CASCADE , null=True , related_name='message_sender')
    recipient =models.ForeignKey(User , on_delete=models.CASCADE , null=True , related_name='message_recipient')

    def serialize(self):
        return {
            'id': self.id,
            'timestamp': self.timestamp,
            'content' :self.content,
            'recipient' : self.recipient.username,
            'sender' : self.sender.username,
        }

class Invitation(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='sent_invitations')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='received_invitations')

    def serialize(self):
        return {
            'id': self.id,
            'sender': self.sender.username,
            'recipient': self.recipient.username,
        }


