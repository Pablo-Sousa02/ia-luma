    import { motion } from 'framer-motion';

    const variants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3, ease: 'easeIn' } },
    };

    export function PageTransition({ children }) {
    return (
        <motion.div
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ height: '100%' }}
        >
        {children}
        </motion.div>
    );
    }
