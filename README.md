## Prerequisits

1. [Install hugo](https://gohugo.io/getting-started/installing/)
2. Install rst2html ` pip install docutils`

## Start

`hugo server --verbose --watch -D`

## Deploy

Currently the static content lives in a bucket on [GCS](https://cloud.google.com/storage/). In order to deploy build
the latest version of the content with:

```
hugo --cleanDestinationDir
```

To sync the files with the storage bucket you need to be authenticated with
`gcloud` on an account which access to the monadic infrastructure project.

If you have access and the google-cloud-sdk tools installed run:

```
gsutil -m -h 'Cache-Control:public,max-age=600' cp -R public/* gs://alpha.radicle.xyz
```
