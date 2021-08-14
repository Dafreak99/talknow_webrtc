# Video Conferencing Application

This is my capstone project, I aim to build something that practical enough in order to strengthen my skills. In the context of the Covid-19 pandemic, direct interactions are being limited. For that reason, I decided to build an application that allows real-time communication between users based on WebRTC peer-to-peer technology.

## Techs

Written in Typescript

- Frontend: WebRTC, React, Redux-toolkit, React-router-dom, React-hook-form
- Backend:
  - NodeJS: Signalling server
  - [Ion-SFU](https://github.com/pion/ion-sfu): Media Server
- Other services: SendGrid

## Features

- :heavy_check_mark: Multiples users - Video/Audio Call
- :heavy_check_mark: Join/Create Room
- :heavy_check_mark: Admission:
  - :heavy_check_mark: None: Everyone can join
  - :heavy_check_mark: Request: Need host's acceptance to join
  - :heavy_check_mark: Password: Provide room password to join
- :heavy_check_mark: Message Channel:
  - :heavy_check_mark: Text
  - :heavy_check_mark: Emoji
  - ❌ File Transfer
- :heavy_check_mark: Screen sharing
- :heavy_check_mark: Record stream
- :heavy_check_mark: Whiteboard
- ❌ Remove user from the room
- ❌ Invite to join via email
