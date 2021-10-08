<template>
    <div class="card-new" :id="id">
        <div class="card-new-inner">
            <div class="card-new-front">
                <img src="../assets/img/cardsW.png" />
            </div>

            <div class="card-new-back">
                {{ text }}

                <img class="bottom-logo" src="../assets/img/iconW.png" />
            </div>
        </div>
    </div>
</template>


<script>
    export default {
        name: "Card",

        props: ['text', 'id']
    }
</script>


<style scoped>
    .card-new {
        width: 140px;
        height: 180px;
        perspective: 1000px;
        font-family: 'HelveticaNeueBold';    
        position: absolute;           
    }

    .card-new-inner {
        position: relative;
        width: 100%;
        height: 100%;        

        transition: transform 0.8s;
        transform-style: preserve-3d;
    }

    .card-new-flipped .card-new-inner {
        transform: rotateX(180deg);
    }

    .card-new:hover .card-new-inner {
        transform: rotateX(180deg);
    }

    .card-new-front {
        display: grid;
        place-items: center;
    }

    .card-new-front, .card-new-back {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: white;
        border-radius: 5px;           
        backface-visibility: hidden;
    }


    .card-new-back {
        padding: 1em;        
        color: black;        
        transform: rotateX(180deg);
    }

    .card-new-back img.bottom-logo {
        position: absolute;
        bottom: 10px;
        left: 10px;
        height: 20px;
    }
</style>