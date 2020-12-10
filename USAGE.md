Using Florence
================

A basic guide to adding content and publishing through Florence.

#### Sign in
Browse to the Florence homepage http://localhost:8081/florence/index.html

If you are running Florence for the first time you will need to login with the setup credentials. You will be asked to change this password.

Username: florence@magicroundabout.ons.gov.uk
Password: Doug4l

#### Create a collection
Content in Florence must be created through a collection. This includes bulletins, articles, content pages, and dataset landing pages.
This does not include [importing a V4 file](#import-a-v4-file), which can be done without a collection, but the content must be
added to a collection in order to be published.

Once signed in to Florence, `Create a collection` options should be apparent.

- Give it any name you want
- Unless specifically testing teams, you can ignore the `Select a team` drop-down
- Choose between manual or scheduled publish - for a quick test manual is usually easiest
- Hit the `Create collection` button

Your collection should now be available in the Collection list

#### Create a content page

- Select an existing collection
- Choose `Create/edit page`
- You will be taken to the 'browse tree' where you can navigate to the 'product page' you want to create content under (for example navigate through `Economy` through to the `Gross Domestic Product` page).
- When you've found the right place, choose `Create`
- On the next page, select the content type from the drop down and fill in the required details (some types will only be available at certain levels, for example bulletins can only be created under a product page) and create the page


#### Create a CMD dataset page

- Check the [recipe](https://github.com/ONSdigital/dp-recipe-api/blob/cmd-develop/recipe/data.go) exists
- Navigate to a product page as described [above](#create-a-content-page)
- Select the 'API dataset' page type
- Select the relevant dataset (this list come from available recipes)

This creates the JSON document that Zebedee and Babbage would use, as well as creating a dataset document in Mongo.
This must be done before importing a V4 file.

#### Import a V4 file

The quickest file to test with is CPIH. These instructions specifically reference a CPIH import file, but any V4 file would work.
- Download the latest [CPIH](https://beta.ons.gov.uk/datasets/cpih01/editions/time-series/versions) CSV file from the Beta
- Sign in to Florence
- Choose the `Datasets` tab
- Select the relevant dataset
- Upload the CSV file
- Select the edition of the dataset you are uploaded. Typically, there is only one value available: `time-series`
- Click the `Submit to publishing` button to start the import process.
- Once you reach the `Your dataset has been submitted` page, there are a few ways you can track the import process:
 - To determine if the entire import is complete, you can refresh the page. Once the import is complete the page will display: `Your dataset upload is complete`
 - If you need more detail, you can use the instance's endpoint: http://localhost:8081/dataset/instances. See the `import_tasks` value for the status of each task within the import. The most recent instance is the first one in the array. Each task will start with a state of `created`, and once complete it will show the state `completed`
For more details on the CMD import process, refer to the [CMD dataset import sequence diagram](https://github.com/ONSdigital/dp-import/blob/develop/docs/import-sequence/CMDDatasetImport.png)

#### Create an account

- Choose `Users and access` from the nav bar
- Provide an email address and password for the new account
- Select the account type - in order to review and approve content, the user must be of type `administrator` or `publisher`
- `Create user`
- Sign out and sign back in - you will be asked to update the password on first log in

#### Publish a collection

In order to publish a collection, it must be submitted, reviewed and approved.

- In an existing collection, go into any content that's in the `In progress` area and `Submit for review`
- Sign in as another user ([create one](#create-an-account) if needed)
- Select the collection and go into each piece of content and `Approve`
- Once all content in the collection has been approved, the `Approve` option will also appear on the collection
- Approving the collection will move it to the 'publishing queue'
- If it's a manual collection:
  - Choose `Publishing queue` from the nav bar
  - Select the `[manual collection]` category in the publish date list
  - Select your collection and `Publish`
