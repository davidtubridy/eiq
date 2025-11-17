# Empathy IQ

[Empathy IQ](https://empathy-iq-c9a90.firebaseapp.com/surveys)

## Solution Overview

This project uses **NX** to manage an integrated monorepo Angular application and shared libraries. The architecture follows domain-driven design.

### Project Structure

```
eiq/
├── apps/
│   ├── eiq/                  # Main app
│   ├── eiq-e2e/              # E2E tests(TODO)
│
│
├── libs/                    # Shared libraries
   ├── shared/               # Common shared components/models
   │   ├── models/           # Data models
   │   └── ui/               # Reusable UI components
   │
   └── surveys/              # Survey domain
       ├── data-access/      # API services
       ├── survey-list/      # Survey list feature
       └── survey-notepad/   # Survey notepad feature
```

## CI/CD

The project uses **GitHub Actions** for continuous integration and continuous deployment with the following automated workflow:

- **On Pull Requests**: Builds, tests and linting
- **On Push to Main**: Deploys the application to Firebase [Empathy IQ](https://empathy-iq-c9a90.firebaseapp.com/surveys)

## Runing the application locally

To run the dev server for your app:

First update apps/eiq/project.json process.env values

- Required :
  - `X_API_KEY` - Application API key
  - `API_URL` - Backend endpoint

```sh
npx npm install
```

```sh
npx nx serve eiq
```

## Runing tests

```sh
npx nx run-many --all --target=test
```

## Assumptions/Decisions

- Created a simple design for the list of surveys. Hitting create survey just creates a generic survey and refreshes the page. It would ideally navigate to the survey.

- I attempted to use no libraries for the design or icons but eventually used mat-icons to speed things up. Which has lead to there being some inconsistencies in the icons used.

- I ended up adding the functionality to delete items and questions as I feel this is a need to have for a product like this.

- For the dropdown options. I assumed that the difference between single and multiple was that a user can only select a single item in the list when they would see it in the survey. And they can select multiple for multiple. For single line input I assumed that it was just a text box input. Swapping between single line and everything else changes from a list of options to a text box.
- I assumed the randomize options did not change the order of the items in the list. But only used for when a user received the actual survey that the questions will be in a random order.

## Suggestions

- The search bar in the dropdown may be unnecessary if there are only 4 options.
- Dialog component when clicking on add question which will allow you to select the question type and options before creating the question.
- Ability to re-order questions and options.
- Ability to delete items and questions.
- Button for adding question choices.
- Endpoint to delete notebooks
- Question copy functionality.
- Survey preview where you can get a preview of exactly what the user will see when they receive their survey.
- Depending on how many questions can be added to a notebook. Questions could be wrapped in an expansion panel if there are going to be a lot of questions.

## Improvements I would make if I had more time

- Styling inconsistencies with Figma.
- Use the same icons as in Figma
- Split out common SCSS and create a structured approach to styling components.
- E2E Tests.
- Error Handling
- Common Loading/Error placeholder components.
- Saving Indicator
- The survey-questions component has grown larger than expected so I wuold split it into multiple components.
- Fix any issues reported on Lighthouse.
- Added Transloco for translation.
- Improved design for the survey list page and header.
- Shared utils library and somewhere to store common const values.
- Investigate using a lightweight signal store for keeping track of a notebooks state.
- Clear navigation when going from a survey to the surver list.
