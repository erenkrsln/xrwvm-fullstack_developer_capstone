from django.http import JsonResponse
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.models import User
import logging
import json
from django.views.decorators.csrf import csrf_exempt

from .models import CarMake, CarModel
from .populate import initiate


# Get an instance of a logger
logger = logging.getLogger(__name__)


# Create a `login_request` view to handle sign in request
@csrf_exempt
def login_user(request):
    data = json.loads(request.body)

    username = data['userName']
    password = data['password']

    user = authenticate(username=username, password=password)

    data = {"userName": username}

    if user is not None:
        login(request, user)

        data = {
            "userName": username,
            "status": "Authenticated"
        }

    return JsonResponse(data)


# Create a `logout_request` view to handle sign out request
def logout_request(request):
    logout(request)

    data = {
        "userName": ""
    }

    return JsonResponse(data)


# Create a `registration` view to handle sign up request
@csrf_exempt
def registration(request):
    data = json.loads(request.body)

    username = data['userName']
    password = data['password']
    first_name = data['firstName']
    last_name = data['lastName']
    email = data['email']

    username_exist = False

    try:
        User.objects.get(username=username)
        username_exist = True
    except User.DoesNotExist:
        logger.debug("%s is new user", username)

    if not username_exist:
        user = User.objects.create_user(
            username=username,
            first_name=first_name,
            last_name=last_name,
            password=password,
            email=email
        )

        login(request, user)

        data = {
            "userName": username,
            "status": "Authenticated"
        }

        return JsonResponse(data)

    data = {
        "userName": username,
        "error": "Already Registered"
    }

    return JsonResponse(data)


# Get the list of cars
def get_cars(request):
    count = CarMake.objects.filter().count()
    print(count)

    if count == 0:
        initiate()

    car_models = CarModel.objects.select_related('car_make')

    cars = []

    for car_model in car_models:
        cars.append({
            "CarModel": car_model.name,
            "CarMake": car_model.car_make.name
        })

    return JsonResponse({
        "CarModels": cars
    })


# Update the `get_dealerships` view to render the index page with
# a list of dealerships
# def get_dealerships(request):
#     ...


# Create a `get_dealer_reviews` view to render the reviews of a dealer
# def get_dealer_reviews(request, dealer_id):
#     ...


# Create a `get_dealer_details` view to render the dealer details
# def get_dealer_details(request, dealer_id):
#     ...


# Create an `add_review` view to submit a review
# def add_review(request):
#     ...