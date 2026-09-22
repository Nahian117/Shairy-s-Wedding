# Shairy's Wedding — manual media website

This version does NOT use Google Drive integration.

## Put your files here

```
media/
  holud/
    all Holud JPG files
  wedding/
    all Wedding JPG files
  videos/
    1.0 Haldi.Full.Video.mp4
    2.0 Haldi.Promo.mp4
    3.0 Wedding.Full.mp4
```

The two bridal photos supplied for the front page are already in `assets/hero-1.jpg` and `assets/hero-2.jpg`.

## Important: the website can handle your whole collection, but GitHub should not host 11.1 GB of media

For local testing, place the files in the folders above and run `generate-manifest.ps1`. It automatically lists every JPG and MP4.

For GitHub Pages, the code is ready, but GitHub is not a suitable place to upload an 11.1 GB wedding archive. Keep the originals elsewhere if the public website becomes large. The front-end itself is static and can be hosted on GitHub Pages.

## Files shown in your screenshots

The included manifest currently contains the filenames visible in your screenshots:
- Holud: DSC04548.JPG through DSC04561.JPG
- Wedding: ART07207.jpg through ART07268.jpg
- Videos: 1.0 Haldi.Full.Video.mp4, 2.0 Haldi.Promo.mp4, 3.0 Wedding.Full.mp4

If there are more files, copy them into the appropriate folders and run the PowerShell generator to rebuild the manifest automatically.

## Local preview

Double-clicking index.html may work for the images, but some browsers restrict local media/video loading. If needed, run a local server in this folder:

```
py -m http.server 8000
```

Then open `http://localhost:8000`.

## GitHub Pages

Upload the website code. For the full media archive, be aware of GitHub's repository/file-size limitations; do not treat GitHub as the storage location for an 11.1 GB wedding archive.
