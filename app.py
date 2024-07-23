from flask import Flask, render_template, request, jsonify, redirect, url_for
import random

app = Flask(__name__)

# List of countries with their names and flag image paths
countries = [
    {"name": "Afghanistan", "flag": "Afghanistan.png"},
    {"name": "Albania", "flag": "Albania.png" },
    {"name": "Algeria", "flag": "Algeria.png"},
    {"name": "Andora", "flag": "Andora.png"},
    {"name": "Angola", "flag": "Angola.png"},
    {"name": "Antigua and Barbuda", "flag": "Antigua and Barbuda.png"},
    {"name": "Argentina", "flag": "Argentina.png"},
    {"name": "Armenia", "flag": "Armenia.png"},
    {"name": "Aruba", "flag": "Aruba.png"},
    {"name": "Australia", "flag": "Australia.png"},
    {"name": "Austria", "flag": "Austria.png"},
    {"name": "Azerbaijan", "flag": "Azerbaijan.png"},
    {"name": "The Bahamas", "flag": "The Bahamas.png"},
    {"name": "Bahrain", "flag": "Bahrain.png"},
    {"name": "Bangladesh", "flag": "Bangladesh.png"},
    {"name": "Barbados", "flag": "Barbados.png"},
    {"name": "Belarus", "flag": "Belarus.png"},
    {"name": "Belgium", "flag": "Belgium.png"},
    {"name": "Belize", "flag": "Belize.png"},
    {"name": "Benin", "flag": "Benin.png"},
    {"name": "Bhutan", "flag": "Bhutan.png"},
    {"name": "Bolivia", "flag": "Bolivia.png"},
    {"name": "Bosnia and Herzegovina", "flag": "Bosnia and Herzegovina.png"},
    {"name": "Bonaire", "flag": "Bonaire.png"},
    {"name": "Botswana", "flag": "Botswana.png"},
    {"name": "Brazil", "flag": "Brazil.png"},
    {"name": "Brunei", "flag": "Brunei.png"},
    {"name": "Bulgaria", "flag": "Bulgaria.png"},
    {"name": "Burkina Faso", "flag": "Burkina Faso.png"},
    {"name": "Burundi", "flag": "Burundi.png"},
    {"name": "Cabo Verde (Cape Verde)", "flag": "Cabo Verde.png"},
    {"name": "Cambodia", "flag": "Cambodia.png"},
    {"name": "Cameroon", "flag": "Cameroon.png"},
    {"name": "Canada", "flag": "Canada.png"},
    {"name": "Central African Republic", "flag": "Central African Republic.png"},
    {"name": "Chad", "flag": "Chad.png"},
    {"name": "Chile", "flag": "Chile.png"},
    {"name": "China", "flag": "China.png"},
    {"name": "Colombia", "flag": "Colombia.png"},
    {"name": "Comoros", "flag": "Comoros.png"},
    {"name": "Democratic Republic of the Congo", "flag": "Democratic Republic of the Congo.png"},
    {"name": "Republic of the Congo", "flag": "Republic of the Congo.png"},
    {"name": "Costa Rica", "flag": "Costa Rica.png"},
    {"name": "Côte d'Ivoire", "flag": "Côte d'Ivoire.png"},
    {"name": "Croatia", "flag": "Croatia.png"},
    {"name": "Cuba", "flag": "Cuba.png"},
    {"name": "Curaçao", "flag": "Curaçao.png"},
    {"name": "Cyprus", "flag": "Cyprus.png"},
    {"name": "Czech Republic", "flag": "Czech Republic.png"},
    {"name": "Denmark", "flag": "Denmark.png"},
    {"name": "Djibouti", "flag": "Djibouti.png"},
    {"name": "Dominica", "flag": "Dominica.png"},
    {"name": "Dominican Republic", "flag": "Dominican Republic.png"},
    {"name": "East Timor", "flag": "East Timor.png"},
    {"name": "Ecuador", "flag": "Ecuador.png"},
    {"name": "Egypt", "flag": "Egypt.png"},
    {"name": "El Salvador", "flag": "El Salvador.png"},
    {"name": "Equatorial Guinea", "flag": "Equatorial Guinea.png"},
    {"name": "Eritrea", "flag": "Eritrea.png"},
    {"name": "Estonia", "flag": "Estonia.png"},
    {"name": "Eswatini (SwazilandEsw)", "flag": "Eswatini.png"},
    {"name": "Ethiopia", "flag": "Ethiopia.png"},
    {"name": "Faroe Islands", "flag": "Faroe Islands.png"},
    {"name": "Fiji", "flag": "Fiji.png"},
    {"name": "Finland", "flag": "Finland.png"},
    {"name": "France", "flag": "France.png"},
    {"name": "Gabon", "flag": "Gabon.png"},
    {"name": "The Gambia", "flag": "The Gambia.png"},
    {"name": "Georgia", "flag": "Georgia.png"},
    {"name": "Germany", "flag": "Germany.png"},
    {"name": "Ghana", "flag": "Ghana.png"},
    {"name": "Greece", "flag": "Greece.png"},
    {"name": "Grenada", "flag": "Grenada.png"},
    {"name": "Greenland", "flag": "Greenland.png"},
    {"name": "Guadeloupe", "flag": "Guadeloupe.png"},
    {"name": "Guam", "flag": "Guam.png"},
    {"name": "Guatemala", "flag": "Guatemala.png"},
    {"name": "Guinea", "flag": "Guinea.png"},
    {"name": "Guinea-Bissau", "flag": "Guinea-Bissau.png"},
    {"name": "Guyana", "flag": "Guyana.png"},
    {"name": "Haiti", "flag": "Haiti.png"},
    {"name": "Honduras", "flag": "Honduras.png"},
    {"name": "Hungary", "flag": "Hungary.png"},
    {"name": "Iceland", "flag": "Iceland.png"},
    {"name": "India", "flag": "India.png"},
    {"name": "Indonesia", "flag": "Indonesia.png"},
    {"name": "Iran", "flag": "Iran.png"},
    {"name": "Iraq", "flag": "Iraq.png"},
    {"name": "Ireland", "flag": "Ireland.png"},
    {"name": "Israel", "flag": "Israel.png"},
    {"name": "Italy", "flag": "Italy.png"},
    {"name": "Jamaica", "flag": "Jamaica.png"},
    {"name": "Japan", "flag": "Japan.png"},
    {"name": "Jordan", "flag": "Jordan.png"},
    {"name": "Kazakhstan", "flag": "Kazakhstan.png"},
    {"name": "Kenya", "flag": "Kenya.png"},
    {"name": "Kiribati", "flag": "Kiribati.png"},
    {"name": "North Korea", "flag": "North Korea.png"},
    {"name": "South Korea", "flag": "South Korea.png"},
    {"name": "Kosovo", "flag": "Kosovo.png"},
    {"name": "Kuwait", "flag": "Kuwait.png"},
    {"name": "Kyrgyzstan", "flag": "Kyrgyzstan.png"},
    {"name": "Laos", "flag": "Laos.png"},
    {"name": "Latvia", "flag": "Latvia.png"},
    {"name": "Lebanon", "flag": "Lebanon.png"},
    {"name": "Lesotho", "flag": "Lesotho.png"},
    {"name": "Liberia", "flag": "Liberia.png"},
    {"name": "Libya", "flag": "Libya.png"},
    {"name": "Liechtenstein", "flag": "Liechtenstein.png"},
    {"name": "Lithuania", "flag": "Lithuania.png"},
    {"name": "Luxembourg", "flag": "Luxembourg.png"},
    {"name": "Macao", "flag": "Macao.png"},
    {"name": "Madagascar", "flag": "Madagascar.png"},
    {"name": "Malawi", "flag": "Malawi.png"},
    {"name": "Malaysia", "flag": "Malaysia.png"},
    {"name": "Maldives", "flag": "Maldives.png"},
    {"name": "Mali", "flag": "Mali.png"},
    {"name": "Malta", "flag": "Malta.png"},
    {"name": "Marshall Islands", "flag": "Marshall Islands.png"},
    {"name": "Mauritania", "flag": "Mauritania.png"},
    {"name": "Mauritius", "flag": "Mauritius.png"},
    {"name": "Mexico", "flag": "Mexico.png"},
    {"name": "Federated States of Micronesia", "flag": "Federated State of Micronesia.png"},
    {"name": "Moldova", "flag": "Moldova.png"},
    {"name": "Monaco", "flag": "Monaco.png"},
    {"name": "Mongolia", "flag": "Mongolia.png"},
    {"name": "Montenegro", "flag": "Montenegro.png"},
    {"name": "Morocco", "flag": "Morocco.png"},
    {"name": "Mozambique", "flag": "Mozambique.png"},
    {"name": "Myanmar (Burma)", "flag": "Myanmar.png"},
    {"name": "Namibia", "flag": "Namibia.png"},
    {"name": "Nauru", "flag": "Nauru.png"},
    {"name": "Nepal", "flag": "Nepal.png"},
    {"name": "Netherlands", "flag": "Netherlands.png"},
    {"name": "New Caledonia", "flag": "New Caledonia.png"},
    {"name": "New Zealand", "flag": "New Zealand.png"},
    {"name": "Nicaragua", "flag": "Nicaragua.png"},
    {"name": "Niger", "flag": "Niger.png"},
    {"name": "Nigeria", "flag": "Nigeria.png"},
    {"name": "Niue", "flag": "Niue.png"},
    {"name": "Northern Ireland", "flag": "Northern Ireland.png"},
    {"name": "Northern Mariana", "flag": "Northern Mariana.png"},
    {"name": "North Macedonia", "flag": "North Macedonia.png"},
    {"name": "Norway", "flag": "Norway.png"},
    {"name": "Oman", "flag": "Oman.png"},
    {"name": "Pakistan", "flag": "Pakistan.png"},
    {"name": "Palau", "flag": "Palau.png"},
    {"name": "Palestine", "flag": "Palestine.png"},
    {"name": "Panama", "flag": "Panama.png"},
    {"name": "Papua New Guinea", "flag": "Papua New Guinea.png"},
    {"name": "Paraguay", "flag": "Paraguay.png"},
    {"name": "Peru", "flag": "Peru.png"},
    {"name": "Philippines", "flag": "Philippines.png"},
    {"name": "Poland", "flag": "Poland.png"},
    {"name": "Portugal", "flag": "Portugal.png"},
    {"name": "Qatar", "flag": "Qatar.png"},
    {"name": "Romania", "flag": "Romania.png"},
    {"name": "Russia", "flag": "Russia.png"},
    {"name": "Rwanda", "flag": "Rwanda.png"},
    {"name": "Saba", "flag": "Saba.png"},
    {"name": "Saint Kitts and Nevis", "flag": "Saint Kitts and Nevis.png"},
    {"name": "Saint Lucia", "flag": "Saint Lucia.png"},
    {"name": "Saint Vincent and the Grenadines", "flag": "Saint Vincent and the Grenadines.png"},
    {"name": "Samoa", "flag": "Samoa.png"},
    {"name": "San Marino", "flag": "San Marino.png"},
    {"name": "São Tomé and Príncipe", "flag": "São Tomé and Príncipe.png"},
    {"name": "Saudi Arabia", "flag": "Saudi Arabia.png"},
    {"name": "Scotland", "flag": "Scotland.png"},
    {"name": "Senegal", "flag": "Senegal.png"},
    {"name": "Serbia", "flag": "Serbia.png"},
    {"name": "Seychelles", "flag": "Seychelles.png"},
    {"name": "Sierra Leone", "flag": "Sierra Leone.png"},
    {"name": "Singapore", "flag": "Singapore.png"},
    {"name": "Slovakia", "flag": "Slovakia.png"},
    {"name": "Slovenia", "flag": "Slovenia.png"},
    {"name": "Solomon Islands", "flag": "Solomon Islands.png"},
    {"name": "Somalia", "flag": "Somalia.png"},
    {"name": "South Africa", "flag": "South Africa.png"},
    {"name": "Spain", "flag": "Spain.png"},
    {"name": "Sri Lanka", "flag": "Sri Lanka.png"},
    {"name": "Sudan", "flag": "Sudan.png"},
    {"name": "South Sudan", "flag": "South Sudan.png"},
    {"name": "St. Eustatius", "flag": "St. Eustatius.png"},
    {"name": "St. Martin", "flag": "St. Martin.png"},
    {"name": "Suriname", "flag": "Suriname.png"},
    {"name": "Sweden", "flag": "Sweden.png"},
    {"name": "Switzerland", "flag": "Switzerland.png"},
    {"name": "Syria", "flag": "Syria.png"},
    {"name": "Taiwan", "flag": "Taiwan.png"},
    {"name": "Tajikistan", "flag": "Tajikistan.png"},
    {"name": "Tanzania", "flag": "Tanzania.png"},
    {"name": "Thailand", "flag": "Thailand.png"},
    {"name": "Togo", "flag": "Togo.png"},
    {"name": "Tonga", "flag": "Tonga.png"},
    {"name": "Trinidad and Tobago", "flag": "Trinidad and Tobago.png"},
    {"name": "Tunisia", "flag": "Tunisia.png"},
    {"name": "Turkey", "flag": "Turkey.png"},
    {"name": "Turkmenistan", "flag": "Turkmenistan.png"},
    {"name": "Tuvalu", "flag": "Tuvalu.png"},
    {"name": "Uganda", "flag": "Uganda.png"},
    {"name": "Ukraine", "flag": "Ukraine.png"},
    {"name": "United Arab Emirates", "flag": "United Arab Emirates.png"},
    {"name": "United Kingdom", "flag": "United Kingdom.png"},
    {"name": "United States of America", "flag": "United States of America.png"},
    {"name": "Uruguay", "flag": "Uruguay.png"},
    {"name": "Uzbekistan", "flag": "Uzbekistan.png"},
    {"name": "Vanuatu", "flag": "Vanuatu.png"},
    {"name": "Vatican City", "flag": "Vatican City.png"},
    {"name": "Venezuela", "flag": "Venezuela.png"},
    {"name": "Vietnam", "flag": "Vietnam.png"},
    {"name": "Wales", "flag": "Wales.png"},
    {"name": "Yemen", "flag": "Yemen.png"},
    {"name": "Zambia", "flag": "Zambia.png"},
    {"name": "Zimbabwe", "flag": "Zimbabwe.png"}
]

# Function to generate options for the flag guessing game
def generate_options(correct_name):
    """
    Generates a list of three options including the correct flag name 
    and two random incorrect ones.
    """
    options = [correct_name]
    while len(options) < 3:
        option = random.choice(countries)["name"]
        if option not in options:
            options.append(option)
    random.shuffle(options)
    return options

# Function to start a new game session
def start_new_game():
    """
    Initializes a new game session by selecting a random country and 
    generating options for it.
    """
    selected_country = random.choice(countries)
    options = generate_options(selected_country["name"])
    return {"country": selected_country, "options": options}

# Initialize the game session
current_game = start_new_game()
correct_guesses = 0
incorrect_guesses = 0

# Route for the home page
@app.route('/')
def index():
    """
    Renders the home page.
    """
    return render_template('index.html')

# Route for the game page
@app.route('/game')
def game():
    """
    Renders the game page and starts a new game session.
    """
    global current_game
    current_game = start_new_game()
    return render_template('game.html', game=current_game)

# Route for the about page
@app.route('/about')
def about():
    """
    Renders the about page.
    """
    return render_template('about.html')

# Route for the learn flags page
@app.route('/learnflags')
def learn_flags():
    return render_template('learnflags.html', countries=countries)

# Route to check the player's answer
@app.route('/check_answer', methods=['POST'])
def check_answer():
    """
    Checks the player's answer and updates the correct and incorrect guess counters.
    """
    global current_game, correct_guesses, incorrect_guesses
    data = request.get_json()
    selected_option = data.get('selectedOption')
    correct_option = current_game['country']['name']

    if selected_option == correct_option:
        correct_guesses += 1
        response = {"message": "Correct!", "status": "correct"}
    else:
        incorrect_guesses += 1
        response = {"message": "Incorrect. Try again!", "status": "incorrect"}

    return jsonify(response)

# Route to start a new game
@app.route('/start_game', methods=['POST'])
def start_game():
    """
    Starts a new game session and sends the flag image and options to the client.
    """
    global correct_guesses, incorrect_guesses, current_game
    correct_guesses = 0
    incorrect_guesses = 0
    current_game = start_new_game()
    return jsonify({"flagUrl": url_for('static', filename=current_game['country']['flag']), "options": current_game['options']})

# Run the Flask application
if __name__ == '__main__':
    app.run()