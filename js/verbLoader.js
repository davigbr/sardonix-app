/**
 * Verb Loader
 * Dynamically includes all split verb data files.
 * Uses document.write to ensure synchronous loading before App initialization.
 */
(function () {
    const letters = "abcdefghijklmnopqrstuvwxyz".split('');
    letters.forEach(letter => {
        document.write(`<script src="js/verbs/verbData_${letter}.js"></script>`);
    });
})();
