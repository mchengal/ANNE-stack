#End 2 End Testing (ngScenario)
To run the end-2-end tests against the application you use Karma or the `runner.html` page.

## Starting the Web Server
In either case you will need the application to be running via the web-server. 
From the root folder of the repository run:

```
node scripts/web-server.js
```

The application should now be available at `http://localhost:8000/app/index.html`

## Testing with Karma
Navigate to root of the project and open command prompt session and run:

```
karma start config/karma.conf.js
```

## Testing in a Browser
Browse directly to the e2e test runner page:

```
http://localhost:8000/test/e2e/runner.html
```

http://www.ng-newsletter.com/posts/practical-protractor.html

running e2e test with protractor.

go to tests/e2e folder and open a new command prompt session and run:
>webdriver-manager start

go to test/e2e folder and open another command prompt session and run:
>protractor e2e-conf.js


