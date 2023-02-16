import SparkMD5 from 'spark-md5'

export const createMD5 = (fileChunkList) => {
    return new Promise((resolve, reject) => {
        const slice =
            File.prototype.slice ||
            File.prototype.mozSlice ||
            File.prototype.webkitSlice
        const chunks = fileChunkList.length
        let currentChunk = 0
        let spark = new SparkMD5.ArrayBuffer()
        let fileReader = new FileReader()
        fileReader.onload = function (e) {
            spark.append(e.target.result)
            currentChunk++
            if (currentChunk < chunks) loadChunk()
            else resolve(spark.end())
        }

        fileReader.onerror = function (e) {
            reject(e)
        }

        function loadChunk() {
            fileReader.readAsArrayBuffer(fileChunkList[currentChunk])
        }

        loadChunk()
    })
}