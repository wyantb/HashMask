
all: package

package: pack-init pack-all

pack-init:
	rm -rf ./builds/current
	mkdir ./builds/current

pack-all:
	cp -rf ./src ./builds/current
	cp -rf ./manifest.json ./builds/current
	cp -rf ./html ./builds/current
	cp -rf ./Changes.md ./builds/current
	cp -rf ./README.md ./builds/current
	cp -rf ./icons ./builds/current
	cp -rf ./lib ./builds/current
	rm -rf ./html/img/
