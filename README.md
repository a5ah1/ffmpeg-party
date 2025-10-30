# ffmpeg.party

Interactive FFmpeg command generators and guides. Build FFmpeg commands visually without memorizing complex syntax.

**Live site:** https://ffmpeg.party

## Features

- Interactive command generators for common FFmpeg tasks
- Encoder guides for x264, x265, and AV1
- Session persistence (form inputs saved automatically)
- Mobile-friendly dark mode interface

## Development

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Start dev server (with live reload)
npm start

# Build for production
npm run build
```

Dev server runs at http://localhost:8080

## Tech Stack

- [Eleventy](https://www.11ty.dev/) - Static site generator
- [Tailwind CSS 4](https://tailwindcss.com/) - Styling
- Vanilla JavaScript - No frameworks

## Deployment

The site automatically deploys to GitHub Pages via GitHub Actions on every push to `main`.

## Contributing

This is a personal project maintained casually. While the code is open source and you're welcome to fork it for your own use, please note that pull requests and issues may not be actively monitored or addressed. Feel free to use this as a starting point for your own FFmpeg tools!

## License

This project is open source. FFmpeg is a trademark of Fabrice Bellard. This project is not affiliated with the FFmpeg project.
