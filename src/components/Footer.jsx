import { motion } from "framer-motion"
import { FaLinkedin, FaGithub } from "react-icons/fa"

const Footer = () => (
  <motion.div
    className="fixed bottom-0 right-0 flex items-center p-1 space-x-4 bg-primary rounded-tl-md dark:text-white"
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.7 }}
  >
    <p className="text-sm text-center font-BarlowCondensed lg:text-base text-white">Made By Mudassir Khan</p>
    <div className="flex items-center justify-center space-x-3">
      <motion.a
        href="https://www.linkedin.com/in/mudassir-khan-522303233/"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <FaLinkedin className="text-2xl text-white cursor-pointer hover:text-blue-200 transition-colors" />
      </motion.a>
      <motion.a
        href="https://github.com/Mudassirkhan2"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
      >
        <FaGithub className="text-2xl text-white cursor-pointer hover:text-gray-200 transition-colors" />
      </motion.a>
    </div>
  </motion.div>
)

export default Footer
