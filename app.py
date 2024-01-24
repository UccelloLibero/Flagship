from flask import Flast, render_template
import random

app = Flask(__name__)

# Defining list of countries and their names
countries = [
    {"name": "Afganistan", "flag": "flags/afganistan.png"},
    {"name": "Albania", "flag": "flags/albania.png" },
    {"name": "Algeria", "flag": "flags/algeria.png"},
    {"name": "Andora", "flag": "flags/algeria.png"},
    {"name": "Angola", "flag": "flags/algeria.png"},
    {"name": "Antigua and Barbuda", "flag": "flags/algeria.png"},
    {"name": "Algeria", "flag": "flags/algeria.png"},
    {"name": "Algeria", "flag": "flags/algeria.png"},
    {"name": "Algeria", "flag": "flags/algeria.png"},
    {"name": "Algeria", "flag": "flags/algeria.png"},
    {"name": "Algeria", "flag": "flags/algeria.png"},
    {"name": "Algeria", "flag": "flags/algeria.png"},
    {"name": "Algeria", "flag": "flags/algeria.png"},
    {"name": "Algeria", "flag": "flags/algeria.png"},
    {"name": "Algeria", "flag": "flags/algeria.png"},
    {"name": "Algeria", "flag": "flags/algeria.png"},
    {"name": "Algeria", "flag": "flags/algeria.png"},
    {"name": "Algeria", "flag": "flags/algeria.png"},
    {"name": "Algeria", "flag": "flags/algeria.png"},
    {"name": "Algeria", "flag": "flags/algeria.png"},
    {"name": "Algeria", "flag": "flags/algeria.png"},
    {"name": "Algeria", "flag": "flags/algeria.png"},
    {"name": "Algeria", "flag": "flags/algeria.png"},
    {"name": "Algeria", "flag": "flags/algeria.png"},
    {"name": "Algeria", "flag": "flags/algeria.png"},
    {"name": "Algeria", "flag": "flags/algeria.png"},
    {"name": "Algeria", "flag": "flags/algeria.png"},

]

def generate_options(correct_option):
    # Generate options randomly with the correct option included
    options = [correct_option]

    while len(options) < 3:
        new_option = f"Option{random.randint(1, 195)}"
        if new_option not in options:
            options.append(new_option)

    # Shuffle the options so that correct option in at a random postion
    random.shuffle(options)
    return options

def get_correct_option(country_name):
    # Take the first letter of the country name as the correct answer
    return "Option" + country_name[0].upper()


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/game')
def game():
    # Randomly select a country
    selected_country = random.choice(countries)

    # Generate options for the selected country
    correct_option = get_correct_option(selected_country['name'])
    selected_country['options'] = generate_options(correct_option)


    # Pass data to the template
    return render_template('game.html', country=selected_country)

if __name__ == '__main__':
    app.run(debug=True)