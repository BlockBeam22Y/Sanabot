module.exports = {
    displayLeaderboard(embed, invites) {
        if (invites.length) {
            for (let i = 0; i < 10; i++) {
                let invite = invites[i]
                if (!invite) break

                embed.addFields({ 
                    name: `${i + 1}. \`${invite.user.tag}\``,
                    value: `${invite.code} - **${invite.joins - invite.leaves} invites**`
                })
            }
        } else {
            embed.setDescription(
                `There are no records yet.

                Be the first to join the race!`
            )
        }
    }
}