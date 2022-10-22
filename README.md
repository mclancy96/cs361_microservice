# Intro

This Node/Express server is used to receive HTTP requests for BMI and BMR and calorie values. It is expected to be run locally. There are two routes that will provide those values:

## /bmi

This route will take the passed data req and send a res body containing the bmi based on those factors.

Formulae:

- Metric:
  - BMI = weight (kg) ÷ height^2 (meters)
- Imperial:
  - BMI = weight (lb) ÷ height^2 (inches) \* 703

Expected Req Body:

```
{
"weight": Integer
"height": Integer
"convertToMetric": Boolean (default is false; expects inches)
}
```

Valid Response Body:

```
{
"bmi": Float
}
```

Example Python Request:

```
import requests
import json


def test():
    url = 'http://localhost:3001'
    route = "/bmi"
    myobj = {
        "weight": 72.57,
        "height": 1.78,
        "convertToMetric": False
    }
    headers = {'content-type': 'application/json'}
    res = requests.post(url+route, data=json.dumps(myobj), headers=headers)
    resParse = json.loads(res.text)
    bmi = resParse["bmi"]

```

## /calories

This route will take the passed data req and send a res body containing the calories based on those factors. This uses the Harris-Benedict equation to calculate the calories needed to maintain the basal metabolic rate based on the values passed.

Formulae:

- Calculate BMR:

  - For men: BMR = 66.5 + (13.75 _ weight in kg) + (5.003 _ height in cm) - (6.75 \* age)
  - For women: BMR = 655.1 + (9.563 _ weight in kg) + (1.850 _ height in cm) - (4.676 \* age)

- Calculate Calories:
  - Sedentary (little or no exercise): calories = BMR × 1.2;
  - Lightly active (light exercise/sports 1-3 days/week): calories = BMR × 1.375;
  - Moderately active (moderate exercise/sports 3-5 days/week): calories = BMR × 1.55;
  - Very active (hard exercise/sports 6-7 days a week): calories = BMR × 1.725; and
  - Extremely active (very hard exercise/sports & a physical job): calories = BMR × 1.9.

Expected Req Body:

```
{
"weight": Integer
"height": Integer
"sex": "male"/"female",
"age": Integer
"activity_level": Integer (see below)
}
```

Activity Levels:

- 0 Sedentary (little or no exercise)
- 1 Lightly active (light exercise/sports 1-3 days/week)
- 2 Moderately active (moderate exercise/sports 3-5 days/week)
- 3 Very active (hard exercise/sports 6-7 days a week)
- 4 Extremely active (very hard exercise/sports & a physical job)
- 5 Professional athlete

Valid Response Body:

```
{
"bmr": Float,
"calories", Float
}
```

Example Python Request:

```
import requests
import json


def test():
    url = 'http://localhost:3001'
    route = "/calories"
    myobj = {
        "weight": 72.57,
        "height": 1.78,
        "sex": "male",
        "age": 24,
        "activity_level": 4
    }
    headers = {'content-type': 'application/json'}
    res = requests.post(url+route, data=json.dumps(myobj), headers=headers)
    resParse = json.loads(res.text)
    bmr = resParse["bmr"]
    calories = resParse["calories"]
```

# How to Run

- Install Node JS if you haven't already
- Navigate to the containing directory and run `npm install`
- Run `node app.js` to start the server.
  - You may need to change the port number if your app is running on the same port. Currently, it's running on port 3001
- While the server is running, make your request using the example Python request as a guide.
