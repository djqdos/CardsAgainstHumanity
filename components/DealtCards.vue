<template>
            <div class="dealtCards">
                <div class="topgrid">
                    <div class="card black-card">
                        {{ $store.state.dealtCards.black.text.replace(/_/g,"_______") }}
                        <img src="../assets/img/iconB.png" />
                    </div>

                    <div class="userCards" :class="`${$store.state.dealtCards.black.pick}col`">
                        <div v-for="index in $store.state.dealtCards.black.pick" :key="index"
                             v-on:drop="drop"
                             v-on:dragover="allowDrop"
                             v-on:dragenter="dragEnter"
                             v-on:dragleave="dragLeave"
                             :id="`userCardId-${index}`"
                             :data-dropzone-id="`${index}`"
                             class="userCardToPick">
                        </div>
                    </div>

                    <input type="button" 
                           id="submitChoice" 
                           name="submitCoice" 
                           value="Submit Choice"
                           @click="submitChoice" />
                </div>
                <div class="white-card-container">
                    <!-- <div v-for="(whiteCard, index) in cards" :key="whiteCard.text"
                         :draggable="whiteCard.draggable"               
                         :id="`whitecard-${index}`"                
                         v-on:dragstart="drag"                                                 
                         class="card white-card white-card-anim" 
                         :class="whiteCard.selected ? 'currentSelected' : ''"                                         
                        >
                        {{ whiteCard.text}}
                        <img src="../assets/img/iconW.png" />
                    </div> -->
                    <Card v-for="(whiteCard, index) in cards" :key="whiteCard.text"
                          :id="`whitecard-${index}`" 
                          :draggable="whiteCard.draggable"
                          :class="whiteCard.selected ? 'currentSelected' : ''"
                          :text="whiteCard.text"
                          v-on:dragstart="drag"
                          
                          />
                </div>                
            </div>
</template>

<script>
    import Card from '../components/card.vue'

    export default {
        name: "DealtCards",
        data() {
            return {              
                cards: []
            }
        },

        created() {
            this.$store.state.dealtCards.white.forEach((item, index) => {
                const c = {
                    text: item.text,
                    id: "whitecard-" + index,
                    draggable: true,
                    selected: false
                };
                this.cards.push(c);
            });
        },

        mounted() {
            setTimeout(() => {
                this.cssDeal();
            }, 3000);
            
        },

        methods: {
            cssDeal() {

                




                var singleCard = document.querySelector(".card-new");                
                console.log("singleCard = ", singleCard);
                
                var left = 0;
                var card_width = singleCard.clientWidth;
                var card_height = singleCard.clientHeight;
                var card_spacing = 10;

                var top = '' // initial top margin for card placement
                var left_stop = card_width + card_spacing; // initial left margin for card placement


                var sec_step = 100; // time lag between each card placement
                var time = 0;
                var card_container_width = document.querySelector(".white-card-container").clientWidth;

                var _cards = document.querySelectorAll(".card-new");
                _cards.forEach((item, index) => {
                    var _card = item;
                    setTimeout(() => {
                        _card.style.marginTop = top + "px";
                        _card.style.marginLeft = left + "px";

                        left = left + left_stop;
                        //if card cannot fit in current row, then place card
                        // in next row
                        if(left+card_width + card_spacing > card_container_width)
                        {
                            left = 0;
                            top += card_height + card_spacing;
                        }
                    }, time);
                    time += sec_step;
                });

            },




            allowDrop(e) {
                e.preventDefault();                        
            },
            drag(e) {            
                e.dataTransfer.setData("text", e.target.id);            
            },
            drop(e) {
                e.preventDefault();                
                var data = e.dataTransfer.getData("text", e.target.id);
                const target = document.getElementById(e.currentTarget.id);
                const index = target.getAttribute("data-dropzone-id");
                const pickedCard = document.getElementById(data);                                
                var oldCard = null;

                if(target.hasChildNodes()) {
                    console.log("has childNodes")
                    console.log("child nodes = ", target.childNodes);
                    oldCard = document.getElementById(target.childNodes[0].id);
                    console.log("old cardddd = ", oldCard);
                }

                this.setCard(index, pickedCard.id, oldCard);
                this.copyCardToDropZone(target.id, pickedCard.id);
            },
            dragEnter(e) {
                e.preventDefault();
                e.target.classList.add("droppable");
            },
            dragLeave(e) {
                e.preventDefault();
                e.target.classList.remove("droppable");
            },
            setCard(index, pickedCardId, oldCard) {  
                const pickedCard = this.cards.filter(x => x.id === pickedCardId)[0];                                               
                pickedCard.selected = true;
                pickedCard.draggable = false;

                console.log("old card = ", oldCard);

                if(oldCard !== null) {
                    const oldPick = this.cards.filter(x => x.id === oldCard.id)[0];
                    oldPick.selected = false;
                    oldPick.draggable = true;
                }
            },
            submitChoice(e) {
                e.preventDefault();
                const submittedChoice = {
                    user: this.$store.state.currentUser,
                    black: this.$store.state.dealtCards.black.text,
                    submissions: this.cards.filter(x => x.selected)
                };

                this.$socket.client.emit("submitChoice", submittedChoice);
            },
            copyCardToDropZone(targetId, cardId) {
                const currentCard = document.getElementById(cardId);
                const target = document.getElementById(targetId);
                const newNode = currentCard.cloneNode(true);

                if(target.hasChildNodes()) {
                    const existingId = document.getElementById(target.childNodes[0].id);                                        
                    target.removeChild(target.childNodes[0]);
                }
                target.appendChild(newNode);
                
            }
        },

        components: {
            Card
        }
    }
</script>