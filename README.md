# DevsuFrontendBp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.0.

# Project information

## Architecture

The application's architecture is based on DDD, where each folder inside the app folder represents a domain.

Each domain is organized by layers. The `features` layer contains smart components, each one representing a feature (usually a complete page). The `ui` layer contains dumb components that are not attached to any use case, they can be shared across multiple features. The `data-access` layer contains services that directly interact with the API. Inside the `domain` layer you will find validators, everything related to state management and facades. Finally, the `shell` layer exposes the entry point to the domain (routes usually).

Application also has a basic state management without using any external libraries like NgRx, just signals (modern approach) but it could have been done just using Subjects and BehaviorSubjects.
In this case, facades handle state management to avoid adding more complexity to the application, but in a larger application, handling state management in a separate class would be a better idea.

## Features

### Products list

![Products list feature](./src/assets/png/products-list.png 'Products list feature')
The products list feature contains the table with the paginated list of products, where you can filter them by name, chose between editing or deleting them and change page.

**Note:** The deleting logic was implemented (so you can check the code for deleting a product without any problem), but I was not able to make it work since I was getting an 404 status error saying that I must be the owner even though I was sending the AuthorId header correctly. I tried it on Postman and got the same error.

### Create/edit product form

![Create/edit product form](./src/assets/png/product-form.png 'Create/edit product form')
The create/edit product feature contains a form that will be reused to create a product or edit an existing product. The send button will be disable as long as the form is invalid. The reset button allows you to reset the form (if you are updating a product, resetting the form will undo any unsaved changes and restore the information of the product).
You also have a link to complete the navigation flow and be able to go back to the products list page. All validations were applied as requested. Also creating a new product will redirect you to the edit form in case you put something incorrect while creating, this is an UX improvement.

## Testing

![Code coverage](./src/assets/png/code-coverage.png 'Code coverage')
All files were tested. Application has a 100% code coverage.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
