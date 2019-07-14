// nomodule 使用 babel
module.exports={
    output:{
        filename:"[name].bundle.js"
    },
    module:{

        rules: [
            {
                test: /\.?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
};