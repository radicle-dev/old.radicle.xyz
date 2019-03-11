all: build

build:
	@hugo --cleanDestinationDir

deploy: build
	rm public/garden/index.html
	@find public | grep -v garden | gsutil -m -h 'Cache-Control:public,max-age=600' cp -R public/* gs://alpha.radicle.xyz

watch:
	@hugo server --verbose --watch -D	
