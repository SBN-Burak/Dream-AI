import sys
import asyncio
import replicate
from dotenv import load_dotenv

load_dotenv()

async def get_output(user_input):
    return replicate.run(
        "replicate/llama-2-70b-chat:2c1608e18606fad2812020dc541930f2d0495ce32eee50074220b87300bc16e1",
        input={
            "prompt": f"{user_input}",
            "system_prompt": '''''',
            "max_new_tokens": 500,
            "temperature": 0.75,
        }
    )

async def main():
    user_input = sys.argv[1]
    output_generator = await get_output(user_input)
    output_list = list(output_generator)  # Convert the generator to a list
    output_str = "".join(output_list)     # Join the list elements into a single string
    print(output_str)

# Run the asyncio event loop
if __name__ == "__main__":
    asyncio.run(main())
