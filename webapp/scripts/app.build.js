({
    appDir: "../",

    baseUrl: "scripts/",

    dir: "../../target",

    // Comment out the optimize line if you want
    // the code minified by Closure Compiler using
    // the "simple" optimizations mode
    optimize: "none",

    optimizeCss: "standard",

    optimizeAllPluginResources: true,

    modules: [
        {
            name: "harViewer",
            include: [
                "nls/harViewer",
                "nls/homeTab",
                "nls/pageStats",
                "nls/previewTab",
                "nls/requestBody",
                "nls/requestList"
            ],
            excludeShallow: [
                "domplate/domplate",
                "core/trace"
            ]
        },
        {
            name: "harPreview",
            include: [
                "nls/requestBody",
                "nls/requestList"
            ],
            excludeShallow: [
                "domplate/domplate",
                "core/trace"
            ]
        }
    ]
})
