use crate::my_player::MyPlayerRef;

type E2EResult<T> = Result<T, Box<dyn std::error::Error>>;

#[ink_e2e::test]
fn instantiation_works(mut client: Client) -> E2EResult<()> {
    let _contract = client
        .instantiate(
            "my-player",
            &ink_e2e::alice(),
            MyPlayerRef::new((10, 10), 1),
            0,
            None,
        )
        .await
        .expect("Failed to instantiate contract");

    Ok(())
}
