export default function About() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-[56rem] m-auto px-3 space-y-6">
        <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
          About this app
        </h1>
        <p className="max-w-[26rem] text-neutral-300 text-justify">
          BooChat is a web app I have created to demonstrate modern chat
          application development skills. It has been designed with Figma and
          built using Node.js, Express and MongoDB for the server-side and
          React for the client-side, with Socket.io for real-time communication
          between users.
        </p>
        <ul className="space-y-3">
          <li>
            <a
              href="https://github.com/ankit227060/ChatApp"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-white hover:underline"
            >
              Code on GitHub
            </a>
          </li>
        </ul>
      </div>
    </section>
  )
}
