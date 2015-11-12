# DataWake
DataWake is a [Node.js](https://nodejs.org/en/) [Express](http://expressjs.com/) application with a mongoDB database. The application aggregates user browsing data via a plug-in using domain-specific searches.  This captured, or extracted, data is organized into browse paths and elements of interest.  This information, in the form of Trails , can be shared or expanded amongst teams of individuals.  Elements of interest which are extracted either automatically, or manually by the user, are given weighted values.  Extracted elements that are not of interest or might be confused with an element that is of interest (e.g. an Organization with a similar name but not associated in any meaningful way to the one being researched) can be manually removed from the extracted data list.

Additionally, the application can be configured to export all page contents and extracted information to RESTFul services, Elasticsearch, or Kafka.

## Companion projects
* [Datawake Sample Extractor](https://github.com/Sotera/DatawakeSampleExtractor) Sample project for wrapping an extractor.
### Other projects
* [DataWake Prefetch](https://github.com/Sotera/datawake-prefetch) Streaming search with scraping and entity extraction of all results.
* [Firmament](https://github.com/Sotera/firmament) Provides a simplified configuration of interconnected Docker containers.

More information including build information can be found at our [Github Page](http://sotera.github.com/Datawake).

DataWake is part of the [DARPA Memex Open Catalog](http://opencatalog.darpa.mil/MEMEX.html)

For more information, please email [memex@soteradefense.com](mailto:memex@soteradefense.com).
