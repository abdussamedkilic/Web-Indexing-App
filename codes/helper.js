module.exports = {
    wordCountMap: function (str) {
        var hist = {}, words = str.split(/[\s*\.*\,\;\+?\#\|:\-\/\\\[\]\(\)\{\}$%&0-9*]/)
        for (i in words)
            if (words[i].length > 1)
                hist[words[i]] ? hist[words[i]] += 1 : hist[words[i]] = 1;
        return hist;
    },
    addWordsToDictionary: function (wordCountmap, dict) {
        for (let key in wordCountmap) {
            dict[key] = true;
        }
    },
    wordMapToVector: function (map, dict) {
        let wordCountVector = [];
        for (let term in dict) {
            wordCountVector.push(map[term] || 0);
        }
        return wordCountVector;
    },
    dotProduct: function (vecA, vecB) {
        let product = 0;
        for (let i = 0; i < vecA.length; i++) {
            product += vecA[i] * vecB[i];
        }
        return product;
    },
    magnitude: function (vec) {
        let sum = 0;
        for (let i = 0; i < vec.length; i++) {
            sum += vec[i] * vec[i];
        }
        return Math.sqrt(sum);
    },
    cosineSimilarity: function (vecA, vecB) {
        return this.dotProduct(vecA, vecB) / (this.magnitude(vecA) * this.magnitude(vecB));
    },
    textCosineSimilarity: function (txtA, txtB) {
        const wordCountA = this.wordCountMap(txtA);
        const wordCountB = this.wordCountMap(txtB);
        let dict = {};
        this.addWordsToDictionary(wordCountA, dict);
        this.addWordsToDictionary(wordCountB, dict);
        const vectorA = this.wordMapToVector(wordCountA, dict);
        const vectorB = this.wordMapToVector(wordCountB, dict);
        return this.cosineSimilarity(vectorA, vectorB);
    },
    getSimilarityScore: function (val) {
        return Math.round(val * 100)
    },
    findUrls: function (text) {
        var source = (text || '').toString();
        var urlArray = [];
        var url;
        var matchArray;

        // Regular expression to find FTP, HTTP(S) and email URLs.
        var regexToken = /(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)|((mailto:)?[_.\w-]+@([\w][\w\-]+\.)+[a-zA-Z]{2,3})/g;

        // Iterate through any URLs in the text.
        while ((matchArray = regexToken.exec(source)) !== null) {
            var token = matchArray[0];
            urlArray.push(token);
        }

        return urlArray;
    },
    Indexing: function (arr) {
        for(i=0;i<arr.length;i++){
            for(j=0;j<arr.length;j++){
                let com1S = arr[i].score.toString().split(" ");
                let com1N = Number(com1S[2]);

                let com2S = arr[j].score.toString().split(" ");
                let com2N = Number(com2S[2]);


                if(com1N < com2N){
                   let temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;
                }

            }
        }

        for(i=0;i<arr.length;i++){
            arr[i].index = i;
        }
        return arr;
    }
}
