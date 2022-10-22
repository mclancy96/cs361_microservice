const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Constants
const port = 3001;
const activityLevelMultiplier = [1.2, 1.375, 1.55, 1.725, 1.9, 2.3];

/**
 * This route will take the passed data req and send a res body containing
 * the bmi based on those factors.
 *
 * Formulae:
 *   Metric:
 *     BMI = weight (kg) ÷ height^2 (meters)
 *   Imperial:
 *     weight (lb) ÷ height^2 (inches) * 703
 *
 * Expected Req Body:
 * {
 *  weight: Integer
 *  height: Integer
 *  convertToMetric: Boolean (default is false; expects inches)
 * }
 *
 * Valid Response Body:
 * {
 *  "bmi": Float
 * }
 */
app.post("/bmi", (req, res) => {
  try {
    // Check the req body for the necessary components
    if (!req.body) {
      res.status(400).send("Error: No body received.");
      return;
    }
    if (!req.body.weight || !req.body.height) {
      res.status(400).send("Missing weight or height");
      return;
    }
    const { weight, height } = req.body;
    let convertToMetric = false;
    if (req.body.convertToMetric) {
      convertToMetric = req.body.convertToMetric;
    }

    // Calculate the BMI
    let bmi;
    if (convertToMetric == true || convertToMetric == "True") {
      bmi = (weight / height ** 2) * 703;
    } else {
      bmi = weight / height ** 2;
    }

    // Send the res
    res.status(200).send({ bmi: bmi });
  } catch (error) {
    res.status(400).send("Error processing request");
  }
});

/**
 * This route will take the passed data req and send a res body containing
 * the calories based on those factors. This uses the Harris-Benedict equation
 * to calculate the calories needed to maintain the basal metabolic rate based
 * on the values passed.
 *
 * Formulae:
 *
 *  Calculate BMR:
 *    For men: BMR = 66.5 + (13.75 * weight in kg) + (5.003 * height in cm) - (6.75 * age)
 *    For women: BMR = 655.1 + (9.563 * weight in kg) + (1.850 * height in cm) - (4.676 * age)
 *
 *  Calculate Calories:
 *    Sedentary: calories = BMR × 1.2;
 *    Lightly active: calories = BMR × 1.375;
 *    Moderately active: calories = BMR × 1.55;
 *    Very active: calories = BMR × 1.725;
 *    Extremely active: calories = BMR × 1.9; and
 *    Professional Athlete: calories = BMR × 2.3.
 *
 * Expected Req Body:
 * {
 *  weight: Integer
 *  height: Integer
 *  sex: "male"/"female",
 *  age: Integer
 *  activity_level: Integer (see below)
 * }
 *
 * Activity Levels:
 * 0 Sedentary (little or no exercise)
 * 1 Lightly active (light exercise/sports 1-3 days/week)
 * 2 Moderately active (moderate exercise/sports 3-5 days/week)
 * 3 Very active (hard exercise/sports 6-7 days a week)
 * 4 Extremely active (very hard exercise/sports & a physical job)
 * 5 Professional athlete
 *
 * Valid Response Body:
 * {
 *  "bmr": Float,
 *  "calories", Float
 * }
 *
 */
app.post("/calories", (req, res) => {
  try {
    // Check the req body for the necessary components
    if (!req.body) {
      res.status(400).send("Error: No body received.");
      return;
    }
    if (
      !req.body.weight ||
      !req.body.height ||
      !req.body.age ||
      !req.body.sex ||
      !req.body.activity_level
    ) {
      res.status(400).send("Missing required parameter");
      return;
    }
    const { weight, height, age, sex, activity_level } = req.body;

    // Calculate the BMR and daily calories
    let bmr;
    if (sex == "female") {
      bmr = 655.1 + 9.563 * weight + 1.85 * height - 4.676 * age;
    } else if (sex == "male") {
      bmr = 66.5 + 13.75 * weight + 5.003 * height - 6.75 * age;
    } else {
      res
        .status(400)
        .send(
          `Error: Harris-Benedict equation requires either 'male' or 'female'. Received: ${sex}`
        );
      return;
    }
    let calories;
    calories = bmr * activityLevelMultiplier[activity_level];

    // Send the res
    res.status(200).send({ bmr, calories });
  } catch (error) {
    res.status(400).send("Error processing request");
  }
});

app.listen(port, () => {
  console.log(`Health app calculator listening on port ${port}`);
});
