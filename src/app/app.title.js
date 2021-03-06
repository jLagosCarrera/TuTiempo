export default ['$transitions', '$window', '$q', ($transitions, $window, $q) => {
    $transitions.onSuccess({}, (transition) => {
        let title = '';
        const tokens = transition.getResolveTokens();
        const resolves = {};
        const promises = tokens.map((token) => {
            const resolved = transition.injector().get(token);
            resolves[token] = resolved;
            return resolved;
        });
        $q.all(promises).then(() => {
            title = resolves.$title;
            $window.document.title = !title ? 'MeteoApp' : title;
        })
    })
}];