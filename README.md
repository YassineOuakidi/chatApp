# Django Chat App

A simple real-time chat application built with Django for the backend, using SQLite for the database, and HTML5, CSS (Bootstrap), JavaScript (AJAX, jQuery) for the frontend. The app is designed to handle real-time messaging with a backend-focused architecture, making use of Django's REST API to manage communication asynchronously.

Note: The frontend of this application was developed quickly and is a simple implementation. The primary focus of the project is the backend functionality, including user authentication and message handling.


## Features

*   Real-time chat functionality (simulated with polling or can be upgraded to WebSockets).
*   User authentication (basic).
*   Private messaging between users.
*   Display of message timestamps.
*   Responsive design using Bootstrap.

## Technologies Used

*   **Backend:**
    *   Django (Python framework)
    *   Django REST Framework (for API)
    *   SQLite (database)
*   **Frontend:**
    *   HTML5
    *   CSS (Bootstrap)
    *   JavaScript
    *   AJAX (for asynchronous communication)
    *   jQuery (for DOM manipulation and AJAX)

## Setup

1.  **Clone the repository:**

    ```bash
    git clone YassineOuakidi/chatApp
    cd chatApp
    ```

2.  **Create a virtual environment (recommended):**

    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Linux/macOS
    venv\Scripts\activate      # On Windows
    ```

3.  **Install dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

4.  **Migrate the database:**

    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

5.  **Create a superuser (for admin access):**

    ```bash
    python manage.py createsuperuser
    ```

6.  **Run the development server:**

    ```bash
    python manage.py runserver
    ```

7.  **Open your browser:** Navigate to `http://127.0.0.1:8000/` in your web browser.

## Django Models 

```python
# chat/models.py
from django.db import models
from django.contrib.auth.models import User

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
```

## API Endpoints (Example)

*   `path("sendNewMessage" , views.send_message , name="sendMessage"),`:
    *   `POST`: Send a new message.
*   `path('conversationMessages' , views.load_conversation_by_id , name="conversationContent"),`:
    *   `GET`: Retrieve messages for a conversation.
 
    
## Further Development
*   Implement WebSockets for true real-time communication.
*   Add user profiles and profile pictures.
*   Implement message read receipts.
*   Improve error handling and security.
*   Add group chat functionality.

## Contributing
*  Contributions are welcome! Please open an issue or submit a pull request.
