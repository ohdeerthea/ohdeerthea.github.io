<!-- Image Organization Guide -->
<!-- 
Images are organized by character with subfolders for each gallery type:

📁 images/
├── 📁 thea/
│   ├── 📁 sfw/        (Safe for work artwork)
│   ├── 📁 nsfw/       (Adult content artwork)
│   └── 📁 ref/        (Reference sheets and character designs)
├── 📁 darla/
│   ├── 📁 sfw/
│   ├── 📁 nsfw/
│   └── 📁 ref/
├── 📁 caelielle/
│   ├── 📁 sfw/
│   ├── 📁 nsfw/
│   └── 📁 ref/
└── 📁 misc/
    ├── 📁 sfw/
    ├── 📁 nsfw/
    └── 📁 ref/

File Naming Conventions:
- Use descriptive filenames: "summer_portrait.jpg" instead of "img001.jpg"
- Avoid spaces in filenames, use underscores: "battle_stance.jpg"
- Keep consistent file extensions: .jpg, .png, .webp
- Use lowercase for consistency

Example file structure:
- images/thea/sfw/summer_portrait.jpg
- images/thea/nsfw/private_moment.jpg
- images/thea/ref/reference_sheet.jpg
- images/darla/sfw/study_scene.jpg
- images/caelielle/sfw/celestial_portrait.jpg

Recommended image specs:
- Format: JPG for photos, PNG for transparency needed
- Width: 800px minimum for good quality display
- File size: Keep under 2MB per image for good loading performance
- Compression: Balance quality vs file size

The JSON helper tool in the admin panel will automatically generate the correct paths
when you specify the character and section.

A placeholder.jpg file is recommended for handling missing images gracefully.
-->
