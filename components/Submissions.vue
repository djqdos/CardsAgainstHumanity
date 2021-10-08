<template>
    <div>
        <div v-if="$store.state.submittedChoice.length === $store.state.users.length">
            <div class="submissions" v-for="(submission, index) in $store.state.submittedChoice" :key="index">
                <div class="username">
                    {{ submission.user.username}}
                </div>
                <div>
                    <div class="card black-card">
                        {{ $store.state.dealtCards.black.text.replace(/_/g,"_______") }}
                        <img src="../assets/img/iconB.png" />
                    </div>
                </div>
                <div class="submissions-whitecard">
                    <div 
                        class="card white-card"                         
                        v-for="(whiteCard, index) in submission.submissions" :key="index"
                        :id="`whitecard-${index}`"                                              
                        >
                        {{ whiteCard.text}}
                        <img src="../assets/img/iconW.png" />
                    </div>                    
                </div>
                
            </div>
        </div>
        <div v-else>
            Waiting for everyone to submit!
        </div>
    </div>
</template>

<script>
export default {
    name: "Submissions",


}
</script>
