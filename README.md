## About the Project

CoLab connects developers to collaboratively solve project issues. List your code issues, and fellow developers can assist via virtual meet rooms with a shared code editor. Communicate through mailing service and earn NFTs for successfully resolving issues.

## Project Description

CoLab is a collaborative platform designed to bring developers together to solve coding and project-related issues in a decentralized and efficient manner. Our platform allows developers facing challenges to list their issues, while other developers can browse, engage, and collaboratively work towards solutions. CoLab combines decentralized communication, scheduling capabilities, and a shared coding environment to create a seamless problem-solving experience.

Key Features:

- Issue Listing and Browsing: Developers can post detailed descriptions of the issues they are facing in their code or projects.

- Decentralized Communication: Integrated decentralized mailing service allows for secure and private communication between developers. Users can send messages, share code snippets, and discuss solutions without leaving the platform.

- Scheduling and Meeting: Developers can schedule calls directly through the platform, selecting convenient times for both parties. Integration with calendar services to send reminders and updates about scheduled meetings.

- Collaborative Problem-Solving: In-meeting shared editor through which developers can collaboratively write, debug, and test code in real-time. Support for multiple programming languages and real-time synchronization to ensure a smooth collaborative experience. Video and audio call integration within the meeting room to facilitate effective communication.

## How it's made

This project utilizes a handful of services provided by Filecoin, Huddle01 and ENS within itself to implement the following functionalities:

- The details of the issues faced by a developer are being stored in Lighthouse storage toolkit. Its uploadText, uploadFile and getUploads functions are used extensively to push and fetch relevant details. The files uploaded in Lighthouse are encrypted and signed before uploading to ensure privacy

- The mailing service ensures smooth communication among the users. All mails are stored in lighthouse storage and it also supports the extensive usage of ENS names within it. Users don't need to type out EOA hex addresses anymore. They can just give out the ENS name to which the mail needs to be sent.

- Developers around the globe can view all the listed issue faced by fellow developers. They can view and solve the issue and try mailing out the solution to the issue creator or even schedule a meet with him/her to engage in detailed discussions.

- Personalised meet rooms are created with the help of Huddle01 based on the scheduled date and time which the users can join at just one click.

- The issue creator after successful solving of the problem can mint an NFT for the issue solver who helped out.



This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.