import { FC } from 'react';

const Home: FC = () => (
  <div className="flex flex-col gap-6 h-screen">
    <main className="flex-grow">{/* TODO: insert modules */}</main>
    <footer className="m-auto">
      <p className="text-slate-600">
        Copyright © 2024 Ruby Yan. All rights reserved.
      </p>
    </footer>
  </div>
);

export default Home;
